import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

    try {

        const { telegram_id, username, first_name } = req.body;

        if (!telegram_id) {
            return res.status(400).json({
                success: false,
                message: "Telegram ID is required"
            });
        }

        const { data, error } = await supabase
            .from("users")
            .upsert(
                {
                    telegram_id: telegram_id,
                    username: username || null,
                    first_name: first_name || "User"
                },
                {
                    onConflict: "telegram_id"
                }
            )
            .select()
            .single();

        if (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        return res.status(200).json({
            success: true,
            user: data
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
}
