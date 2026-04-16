# Exchange Logo Images

This directory contains logo images for exchanges.

## How to Add Logo Images

1. Place your logo image files in this directory (`public/logos/`)
2. Recommended file names (lowercase, with hyphens):
   - `binance.png` or `binance.jpg`
   - `coinbase.png` or `coinbase.jpg`
   - `kraken.png` or `kraken.jpg`
   - `okx.png`
   - `crypto-com.png`
   - `bybit.png`
   - `gemini.png`
   - `bitfinex.png`
   - `huobi.png`
   - `ftx.png`
   - etc.

3. Recommended logo dimensions:
   - Square format: 128x128px or 256x256px
   - Or rectangular: maintain aspect ratio, max 256px width/height
   - Format: PNG (with transparency) or JPG
   - Background: Transparent PNG preferred

4. Update the `logoUrl` in `data/mockExchanges.ts`:
   ```typescript
   logoUrl: '/logos/binance.png',
   ```

## Example

For Binance, if you have a file named `binance.png`:
- Place it in: `public/logos/binance.png`
- In `mockExchanges.ts`, set: `logoUrl: '/logos/binance.png'`

The path should start with `/logos/` (not `/public/logos/`) because Next.js serves files from the `public` directory at the root path.

## Logo Display

Logos are displayed at 48x48px (w-12 h-12) in the exchange cards, with:
- Rounded corners
- Border and padding
- White background
- Automatic error handling (logo hidden if file not found)

