// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

const getGeochip = async (query) => {
    return await axios.get(`${process.env.BOSTON_BASE_URL}/geochip`, {
        params: query,
        responseType: "arraybuffer",
    });
};

export default async function handler({ method, query }, res) {
    switch (method) {
        case "GET":
            try {
                const geo = await getGeochip(query);
                res.status(200).json(
                    Buffer.from(geo.data, "binary").toString("base64")
                );
            } catch (e) {
                res.status(200).json({ error: e });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
