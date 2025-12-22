import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください').max(100, 'お名前は100文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  message: z.string().min(1, 'お問い合わせ内容を入力してください').max(2000, 'お問い合わせは2000文字以内で入力してください'),
});

export type ContactData = z.infer<typeof contactSchema>;
