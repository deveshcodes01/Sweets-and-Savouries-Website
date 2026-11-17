# Radha Krishna Sweets

Premium sweets and savouries storefront with a React/Vite client and Express/Mongoose API. Use Node.js 20 or newer.

## Local setup

1. Run `npm install` at the project root, then `npm install --prefix client` and `npm install --prefix server`.
2. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI` to a reachable local MongoDB or Atlas database. For Atlas, create a database user and allow your current public IP under **Network Access**. Do not commit `.env` or database credentials.
3. Copy `client/.env.example` to `client/.env`. Leave `VITE_API_BASE_URL` blank when using the Vite proxy. Set `VITE_WHATSAPP_NUMBER` only to the business's verified international number in digits only.
4. Add actual products to the MongoDB `products` collection using the `Product` schema. Sample preview products are only shown with a visible notice when the API is unavailable; the API does not return preview records as though they were stored products.
5. Run `npm run dev` at the project root. The client uses port 5173 and the API uses port 5000. Run only one API process. If port 5000 is already occupied, stop the old API process or set `PORT=5001` in `server/.env` and `API_PORT=5001` in `client/.env`, then restart both processes.

Product fields are `name`, `description`, `category`, `image`, `available`, optional `price`, and optional `weightOptions`. Product images can use the local files in `client/public/images/products/`. Prices and business contact details should only be filled with confirmed values.

## Deployment

Build the client with `npm run build`. Serve `client/dist` from a static host configured to rewrite app routes to `index.html`. Deploy the server as a Node service. Configure `MONGODB_URI`, `CLIENT_ORIGIN`, and `PORT` on the server. Set `VITE_API_BASE_URL` to the API origin at client build time when the API is deployed on a separate origin; configure CORS `CLIENT_ORIGIN` to the deployed client origin. `VITE_WHATSAPP_NUMBER` is also a client build-time setting.

## Current configuration status

No MongoDB URI or verified WhatsApp number is committed. Without a live database, `/api/health` and product/contact endpoints report a degraded/unavailable status. The API retries an initial MongoDB connection failure every 30 seconds, so it can recover after Atlas network access is corrected. The browser keeps clearly labeled local preview products visible, preserves a failed contact draft, and displays an actionable error message.
