const express = require('express');
const router = express.Router();

// POST: Get Bearer Token (though this is get-token , palocity accepts POST to get token)
router.post('/get-token', async (req, res) => {
    try {
        const params = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: process.env.GRANT_TYPE,
            scope: process.env.SCOPE
        });

        const response = await fetch(process.env.PAYLOCITY_ENV_URL + "/IdentityServer/connect/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Unauthorized', details: data });
        }

        res.json({ token: data.access_token });
    } catch (error) {
        console.error('Error in get-token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
