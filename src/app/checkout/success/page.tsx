import OrderSuccessClient from './OrderSuccessClient';

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

  return <OrderSuccessClient orderId={orderId} />;
}
