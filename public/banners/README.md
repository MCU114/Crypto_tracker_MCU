# Exchange Banner Images

This directory contains advertisement banner images for exchanges.

## How to Add Banner Images

1. Place your banner image files in this directory (`public/banners/`)
2. Recommended file names (lowercase, with hyphens):
   - `binance.jpg` or `binance.png`
   - `coinbase.jpg` or `coinbase.png`
   - `kraken.jpg` or `kraken.png`
   - etc.

3. Recommended banner dimensions:
   - Width: 728px (standard banner width)
   - Height: 90px (standard banner height)
   - Format: JPG or PNG

4. Update the `bannerUrl` in `data/mockExchanges.ts`:
   ```typescript
   bannerUrl: '/banners/binance.jpg',
   ```

## Example

For Binance, if you have a file named `binance.jpg`:
- Place it in: `public/banners/binance.jpg`
- In `mockExchanges.ts`, set: `bannerUrl: '/banners/binance.jpg'`

The path should start with `/banners/` (not `/public/banners/`) because Next.js serves files from the `public` directory at the root path.

