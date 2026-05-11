// TODO: Replace with your Basin/Formspree endpoint
// Get a free endpoint at https://usebasin.com or https://formspree.io
const BASIN_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || 'https://httpbin.org/post'; // fallback for testing

export async function submitToForm(endpoint: string, data: Record<string, unknown>) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Form submission failed:', err);
    return false;
  }
}

export { BASIN_ENDPOINT };
