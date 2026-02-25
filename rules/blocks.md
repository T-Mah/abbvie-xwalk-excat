# Blocks

Rules and conventions for block-level structure and components.

## Block usage priority

1. **Use existing blocks first, always.** Before introducing any new UI or structural element, check whether an existing block already meets the need.

2. **If no suitable block exists, create a variant.** Extend or customize an existing block (e.g. via props, modifiers, or composition) rather than adding a new block from scratch.

3. **Create a new block only when necessary.** A new block may be added only when there is no existing block that can reasonably be adapted with a variant. Document why the new block was needed.
