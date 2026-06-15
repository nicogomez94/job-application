-- AlterTable
ALTER TABLE "subscriptions"
ADD COLUMN "durationMonths" INTEGER,
ADD COLUMN "billingAmount" DECIMAL(10,2),
ADD COLUMN "billingCurrency" TEXT DEFAULT 'ARS',
ADD COLUMN "billingFrequency" INTEGER,
ADD COLUMN "billingFrequencyType" TEXT DEFAULT 'months',
ADD COLUMN "mercadoPagoPreapprovalId" TEXT,
ADD COLUMN "mercadoPagoExternalReference" TEXT,
ADD COLUMN "mercadoPagoStatus" TEXT,
ADD COLUMN "mercadoPagoInitPoint" TEXT,
ADD COLUMN "nextPaymentDate" TIMESTAMP(3),
ADD COLUMN "lastWebhookAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "psychologist_subscriptions"
ADD COLUMN "durationMonths" INTEGER,
ADD COLUMN "billingAmount" DECIMAL(10,2),
ADD COLUMN "billingCurrency" TEXT DEFAULT 'ARS',
ADD COLUMN "billingFrequency" INTEGER,
ADD COLUMN "billingFrequencyType" TEXT DEFAULT 'months',
ADD COLUMN "mercadoPagoPreapprovalId" TEXT,
ADD COLUMN "mercadoPagoExternalReference" TEXT,
ADD COLUMN "mercadoPagoStatus" TEXT,
ADD COLUMN "mercadoPagoInitPoint" TEXT,
ADD COLUMN "nextPaymentDate" TIMESTAMP(3),
ADD COLUMN "lastWebhookAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "mercado_pago_recurring_payments" (
    "id" TEXT NOT NULL,
    "mercadoPagoAuthorizedPaymentId" TEXT NOT NULL,
    "mercadoPagoPaymentId" TEXT,
    "mercadoPagoPreapprovalId" TEXT,
    "accountType" TEXT NOT NULL,
    "status" TEXT,
    "statusDetail" TEXT,
    "amount" DECIMAL(10,2),
    "currency" TEXT,
    "debitDate" TIMESTAMP(3),
    "rawPayload" JSONB,
    "subscriptionId" TEXT,
    "psychologistSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mercado_pago_recurring_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_mercadoPagoPreapprovalId_key" ON "subscriptions"("mercadoPagoPreapprovalId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_mercadoPagoExternalReference_key" ON "subscriptions"("mercadoPagoExternalReference");

-- CreateIndex
CREATE UNIQUE INDEX "psychologist_subscriptions_mercadoPagoPreapprovalId_key" ON "psychologist_subscriptions"("mercadoPagoPreapprovalId");

-- CreateIndex
CREATE UNIQUE INDEX "psychologist_subscriptions_mercadoPagoExternalReference_key" ON "psychologist_subscriptions"("mercadoPagoExternalReference");

-- CreateIndex
CREATE UNIQUE INDEX "mercado_pago_recurring_payments_mercadoPagoAuthorizedPaymentId_key" ON "mercado_pago_recurring_payments"("mercadoPagoAuthorizedPaymentId");

-- CreateIndex
CREATE INDEX "mercado_pago_recurring_payments_subscriptionId_idx" ON "mercado_pago_recurring_payments"("subscriptionId");

-- CreateIndex
CREATE INDEX "mercado_pago_recurring_payments_psychologistSubscriptionId_idx" ON "mercado_pago_recurring_payments"("psychologistSubscriptionId");

-- CreateIndex
CREATE INDEX "mercado_pago_recurring_payments_mercadoPagoPreapprovalId_idx" ON "mercado_pago_recurring_payments"("mercadoPagoPreapprovalId");

-- CreateIndex
CREATE INDEX "mercado_pago_recurring_payments_status_idx" ON "mercado_pago_recurring_payments"("status");

-- AddForeignKey
ALTER TABLE "mercado_pago_recurring_payments" ADD CONSTRAINT "mercado_pago_recurring_payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mercado_pago_recurring_payments" ADD CONSTRAINT "mercado_pago_recurring_payments_psychologistSubscriptionId_fkey" FOREIGN KEY ("psychologistSubscriptionId") REFERENCES "psychologist_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
