import { Patient, Prisma, UserStatus } from '@prisma/client';
import httpStatus from 'http-status';
import { TPatientFilterRequest, TPatientUpdate } from './patient.interface';
import { TPaginationOptions } from '../../interfaces/pagination';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { TGenericResponse } from '../../interfaces/common';
import { patientSearchableFields } from './patient.constant';
import { prisma } from '../../../helpers/prisma';
import ApiError from '../../errors/ApiError';

const getAllFromDB = async (
  filters: TPatientFilterRequest,
  options: TPaginationOptions,
): Promise<TGenericResponse<Patient[]>> => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    include: {
      medicalReport: true,
      patientHelthData: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.patient.count({
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

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHelthData: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<TPatientUpdate>,
): Promise<Patient | null> => {
  const { patientHelthData, medicalReport, ...patientData } = payload;

  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.patient.update({
      include: {
        medicalReport: true,
        patientHelthData: true,
      },
      where: {
        id,
        isDeleted: false,
      },
      data: patientData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update Patient');
    }

    if(result?.patientHelthData && patientHelthData) {
        await transactionClient.patientHelthData.update({
            where: {
                id: result?.patientHelthData?.id
            },
            data: patientHelthData
        })
    }
   
    if(!result?.patientHelthData && patientHelthData) {
        await transactionClient.patientHelthData.create({
            data:{
                patientId: id,
                ...patientHelthData
            }
        })
    }

    if(medicalReport){
        await transactionClient.medicalReport.create({
            data:{
                patientId: id,
                ...medicalReport
            }
        })
    }
   
    return result;
  });

  const responseData = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHelthData: true,
    },
  });
  return responseData;
};

const deleteFromDB = async (id: string): Promise<Patient> => {
  return await prisma.$transaction(async transactionClient => {
    await transactionClient.patientHelthData.delete({
      where: {
        patientId: id,
      },
    });
    await transactionClient.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    const deletedPatient = await transactionClient.patient.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });
};

const softDelete = async (id: string): Promise<Patient> => {
  return await prisma.$transaction(async transactionClient => {
    const deletedPatient = await transactionClient.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedPatient;
  });
};

export const PatientService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};