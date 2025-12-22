import { z } from 'zod';
import { contactSchema } from '../../lib/contactSchema';

export async function post({ request }) {
  try {
    const body = await request.json();
    const parsed = contactSchema.parse(body);

    const FORM_ID = process.env.FORMSPREE_ID || 'your-form-id';

    const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(parsed),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, data }), { status: res.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ success: false, errors: err.flatten() }), { status: 422, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: false, message: 'サーバーエラー' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
