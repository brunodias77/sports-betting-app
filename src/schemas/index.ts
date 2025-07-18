import { z } from 'zod';
import { SportType, EventStatus, BetPrediction } from '../types';

// Main validation schemas
export const BetSchema = z.object({
  eventId: z.string().min(1, 'Event ID é obrigatório'),
  amount: z.number()
    .min(1, 'Valor mínimo é R$ 1,00')
    .max(1000, 'Valor máximo é R$ 1.000,00')
    .refine((val) => val > 0, 'Valor deve ser positivo'),
  prediction: z.enum([BetPrediction.HOME, BetPrediction.DRAW, BetPrediction.AWAY], {
    message: 'Predição deve ser home, draw ou away'
  }),
  odds: z.number()
    .min(1.01, 'Odd mínima é 1.01')
    .max(50, 'Odd máxima é 50.00')
});

export const DepositSchema = z.object({
  amount: z.number()
    .min(10, 'Depósito mínimo é R$ 10,00')
    .max(5000, 'Depósito máximo é R$ 5.000,00')
    .refine((val) => val > 0, 'Valor deve ser positivo')
    .refine((val) => Number.isInteger(val * 100), 'Valor deve ter no máximo 2 casas decimais')
});

// Additional validation schemas
export const SportEventSchema = z.object({
  id: z.string().min(1, 'ID do evento é obrigatório'),
  homeTeam: z.string().min(1, 'Nome do time da casa é obrigatório'),
  awayTeam: z.string().min(1, 'Nome do time visitante é obrigatório'),
  date: z.date().refine((date) => date > new Date(), 'Data deve ser futura'),
  odds: z.object({
    home: z.number().min(1.01, 'Odd da casa deve ser maior que 1.01'),
    draw: z.number().min(1.01, 'Odd do empate deve ser maior que 1.01').optional(),
    away: z.number().min(1.01, 'Odd do visitante deve ser maior que 1.01')
  }),
  sport: z.enum([SportType.FOOTBALL, SportType.BASKETBALL, SportType.TENNIS, SportType.VOLLEYBALL], {
    message: 'Esporte inválido'
  }),
  status: z.enum([EventStatus.UPCOMING, EventStatus.LIVE, EventStatus.FINISHED], {
    message: 'Status do evento inválido'
  })
});

export const UserSchema = z.object({
  balance: z.number().min(0, 'Saldo não pode ser negativo'),
  totalBets: z.number().min(0, 'Total de apostas não pode ser negativo'),
  totalWins: z.number().min(0, 'Total de vitórias não pode ser negativo'),
  totalLosses: z.number().min(0, 'Total de derrotas não pode ser negativo')
});

export const UpdateBalanceSchema = z.object({
  amount: z.number()
    .min(0.01, 'Valor deve ser maior que zero')
    .refine((val) => Number.isInteger(val * 100), 'Valor deve ter no máximo 2 casas decimais'),
  type: z.enum(['deposit', 'withdraw'], {
    message: 'Tipo deve ser deposit ou withdraw'
  })
});

// Form validation schemas with additional rules
export const BetFormSchema = BetSchema.extend({
  confirmBet: z.boolean().refine((val) => val === true, 'Você deve confirmar a aposta')
});

export const DepositFormSchema = DepositSchema.extend({
  confirmDeposit: z.boolean().refine((val) => val === true, 'Você deve confirmar o depósito')
});

// Type inference from schemas
export type BetFormData = z.infer<typeof BetSchema>;
export type DepositFormData = z.infer<typeof DepositSchema>;
export type SportEventData = z.infer<typeof SportEventSchema>;
export type UserData = z.infer<typeof UserSchema>;
export type UpdateBalanceData = z.infer<typeof UpdateBalanceSchema>;
export type BetFormWithConfirmation = z.infer<typeof BetFormSchema>;
export type DepositFormWithConfirmation = z.infer<typeof DepositFormSchema>;