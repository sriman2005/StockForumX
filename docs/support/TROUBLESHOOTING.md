# Troubleshooting Guide

[← Back to Documentation Index](../README.md)

Common issues and their solutions for StockForumX.

## Installation Issues

### MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1.  **Start MongoDB Service**:
    - Windows: `net start MongoDB`
    - macOS: `brew services start mongodb-community`
2.  **Check URI**: Verify `MONGODB_URI` in `.env`.
3.  **Whitelist IP**: If using Atlas, ensure your IP is allowed.

---

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1.  **Kill Process**:
    - Windows: `netstat -ano | findstr :5000` -> `taskkill /PID <PID> /F`
    - Linux/Mac: `lsof -ti:5000 | xargs kill -9`
2.  **Change Port**: Update `PORT` in `.env`.

---

### Dependencies Installation Failed

**Solutions:**
1.  **Clear Cache**: `npm cache clean --force`
2.  **Reinstall**: Delete `node_modules` and run `npm install`.
3.  **Legacy Peers**: Try `npm install --legacy-peer-deps`.

---

## Runtime Issues

### JWT Token Invalid

**Error:** `Invalid token` or `401 Unauthorized`

**Solutions:**
1.  **Check Secret**: Ensure `JWT_SECRET` matches in `.env`.
2.  **Relogin**: Token might be expired.
3.  **Clear Storage**: Run `localStorage.clear()` in browser console.

---

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1.  **Check Client URL**: Verify `CLIENT_URL` in server `.env`.
2.  **Verify Backend**: Ensure server is running and `cors` middleware is configured.

---

### Email Not Sending

**Error:** `Invalid login` or `Username and Password not accepted`

**Solutions:**
1.  **App Password**: For Gmail, use an App Password, not your login password.
2.  **Check Credentials**: Verify `EMAIL_USER` and `EMAIL_PASSWORD`.

---

### WebSocket Connection Failed

**Error:** `WebSocket connection to ... failed`

**Solutions:**
1.  **Check Health**: Ensure `http://localhost:5000/api/health` returns OK.
2.  **Check Client Config**: Verify `io()` connection string matches server URL.

---

## Frontend Issues

### Blank Page / White Screen

> [!TIP]
> Check the browser console (F12) for error messages.

**Solutions:**
1.  **API Connection**: Ensure backend is running.
2.  **Hard Refresh**: `Ctrl+Shift+R` to clear cache.

### Styling Issues

**Solutions:**
1.  **Class Names**: Check for typos in CSS classes.
2.  **Import Order**: Ensure `index.css` is imported first.

---

## General Debugging

### Enable Debug Mode

**Backend**:
```bash
DEBUG=* npm run dev
```

**Frontend**:
```javascript
localStorage.debug = '*';
```

### Reset Environment

If all else fails:

> [!WARNING]
> The following command can cause permanent data loss.

```bash
# Clear deps and reinstall
rm -rf node_modules
npm run install:all

# Drop Database (WARNING: DATA LOSS)
# mongosh -> use stockforumx -> db.dropDatabase()

# Reseed
cd server && npm run seed
```

## Getting Help

If you still can't resolve the issue:
1.  Search existing **GitHub Issues**.
2.  Check the **Discussions**.
3.  Open a new issue with your error log and environment details.
