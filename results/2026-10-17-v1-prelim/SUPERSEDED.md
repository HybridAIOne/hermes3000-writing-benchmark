# Superseded — faulty configuration

This preliminary run is kept for transparency but is **not** a valid result. The open-weight and
xAI models served through OpenRouter ran without a reasoning effort, while the OpenAI and Google
models had one. Without it, Qwen 3.8, Kimi K3 and GLM-5.3 thought until the 16,000-token budget
was gone and returned no text seven times. Re-tested with `reasoning: { effort: medium }`, the
same prompts produced complete texts.

The corrected preliminary run is `2026-10-17-v1-prelim-r2`.
