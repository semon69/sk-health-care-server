import { Doctor, Prisma } from "@prisma/client";
import { prisma } from "../../../helpers/prisma";
import { TDoctorFilterRequest } from "./doctor.interface";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";


const getAllFromDB = async (
    filters: TDoctorFilterRequest,
    options: TPaginationOptions,
) => {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    };

    // doctor > doctorSpecialties > specialties -> title

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialities: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        })
    };


    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true
                }
            }
        },
    });

    const total = await prisma.doctor.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true
                }
            }
        }
    });
    return result;
};

const updateIntoDB = async (id: string, payload: any) => {
    
};

// const deleteFromDB = async (id: string): Promise<Doctor> => {
//     return await prisma.$transaction(async transactionClient => {
//         const deleteDoctor = await transactionClient.doctor.delete({
//             where: {
//                 id,
//             },
//         });

//         await transactionClient.user.delete({
//             where: {
//                 email: deleteDoctor.email,
//             },
//         });

//         return deleteDoctor;
//     });
// };

// const softDelete = async (id: string): Promise<Doctor> => {
//     return await prisma.$transaction(async transactionClient => {
//         const deleteDoctor = await transactionClient.doctor.update({
//             where: { id },
//             data: {
//                 isDeleted: true,
//             },
//         });

//         await transactionClient.user.update({
//             where: {
//                 email: deleteDoctor.email,
//             },
//             data: {
//                 status: UserStatus.DELETED,
//             },
//         });

//         return deleteDoctor;
//     });
// };



export const doctorService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
}