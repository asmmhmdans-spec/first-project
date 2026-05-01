# Capstone2 Backend Version

## Run the project

```powershell
node server.js
```

Open:

```text
http://localhost:3000
```

## What was added

- Backend server with Node.js, no external packages required.
- Login/register API.
- Product decision saving API.
- Dashboard reads saved decisions from the backend.
- Product price lookup from Jumia Egypt search results.
- Focused local snack and grocery prices for common Egyptian everyday products.
- Local JSON database at `data/db.json`.

## Notes

Snack and small grocery prices use a local Egyptian grocery price list. Larger products are searched on Jumia Egypt and returned in EGP. If the product name is not found, the dashboard shows that the price is not available.
