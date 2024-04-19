import { prisma } from "../../../helpers/prisma";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { sslServices } from "../ssl/ssl.service";
import { PaymentStatus } from "@prisma/client";
import axios from "axios";
import config from "../../config";

const initPayment = async (payload: any, appointmentId: string) => {
  const paymentData = await prisma.payment.findFirst({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  if (!paymentData) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payment information not found!"
    );
  }
  if (paymentData.status === PaymentStatus.PAID) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already pay for the appointment!"
    );
  }

  const paymentSession = await sslServices.initPayment({
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    customerName: paymentData.appointment.patient.name,
    customerEmail: paymentData.appointment.patient.email,
  });

  return {
    paymentUrl: paymentSession.GatewayPageURL,
  };
};

// amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=perso662205bf1b190&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=a99a87f611d172b1c4c932779d60b37e&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id

const validate = async (payload: any) => {
  // uncomment when work locally

  //   if (!payload || !payload?.status || payload?.status !== "VALID") {
  //     return {
  //       massage: "Invalid Payment!",
  //     };
  //   }
  //   const result = await sslServices.validate(payload);

  //     if (result?.status !== 'VALID') {
  //         return {
  //             massage: 'Payment failed'
  //         }
  //     }

  const result = payload;

  await prisma.$transaction(async (transactionClient) => {
    const paymentData = await transactionClient.payment.update({
      where: {
        transactionId: result.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: payload,
      },
    });

    await transactionClient.appointment.update({
      where: {
        id: paymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return {
    massage: 'Payment Success'
};
};

export const PaymentService = {
  initPayment,
  validate,
};
