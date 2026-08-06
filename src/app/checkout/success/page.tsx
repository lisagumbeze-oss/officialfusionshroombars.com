import prisma from '@/lib/prisma';
import OrderSuccessClient from './OrderSuccessClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Order Confirmed | Fusion Shroom Bars',
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId?.toString() ?? null;

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { paymentMethod: true },
      })
    : null;

  return (
    <OrderSuccessClient
      orderId={orderId}
      paymentMethod={order?.paymentMethod ?? null}
      totalAmount={order?.totalAmount}
      status={order?.status}
    />
  );
}
