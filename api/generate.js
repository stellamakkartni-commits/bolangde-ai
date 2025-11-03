export default async function handler(req, res) {
  try {
    const body = await req.json();
    const { prompt, image } = body;
    const hfToken = process.env.HF_TOKEN;

    const r = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { image, num_inference_steps: 25, guidance_scale: 7.5 }
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).send(`Ошибка Hugging Face: ${r.status} ${text}`);
    }

    const b = await r.arrayBuffer();
    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(b));
  } catch (err) {
    res.status(500).send(err.message);
  }
}
