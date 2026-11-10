/**
 * Form submissions via Web3Forms (https://web3forms.com).
 *
 * The access key is designed to be public (it only allows sending to the
 * email address it was registered with). Set VITE_WEB3FORMS_ACCESS_KEY in
 * .env / the hosting provider. Until then forms show a TODO and fail
 * gracefully with a "please call us" message (TODO form-access-key).
 *
 * Forms also work without JavaScript: the pre-rendered <form> posts straight
 * to Web3Forms and redirects back to the page with ?sent=1.
 */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
export const WEB3FORMS_KEY = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined) ?? "";
export const formsConfigured = WEB3FORMS_KEY.length > 0;

export async function submitToWeb3Forms(
  subject: string,
  fields: Record<string, string>,
  botcheck: boolean,
): Promise<{ ok: boolean; message?: string }> {
  if (!formsConfigured) return { ok: false, message: "Form access key not configured" };
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        from_name: "Sai Aarogya Hospital website",
        botcheck,
        ...fields,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    return { ok: res.ok && data.success === true, message: data.message };
  } catch {
    return { ok: false, message: "Network error" };
  }
}
