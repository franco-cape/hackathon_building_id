// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import "../../prisma/patch";

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB
export default async function handler({ method, query }, res) {
  switch (method) {
    case "GET":
      try {
        const creations = await prisma.$queryRaw`
          select rd.external_id, rd.geom::text, rd.tile18_x, rd.tile18_y, rd.cape_survey_id,
              bd.cape_deleted_date, bd.first_post_demolition, bd.id as building_id, bd.first_seen as first_seen, bd.last_seen as last_seen,
              sv.image_date as sv_image_date
          from cape_buildings.buildings as bd
              inner join cape_buildings.roof_detections_buildings as rdb on rdb.building_id = bd.id
              inner join cape_buildings.roof_detections as rd on rd.id = rdb.roof_detection_id
              inner join cape_buildings.surveys as sv on sv.id = rd.cape_survey_id
          where bd.first_seen=sv.image_date
          order by building_id
          LIMIT ${parseInt(query.limit, 10) || 100}
          OFFSET ${parseInt(query.page, 10) || 0}`;
        const responseLength = creations.length;
        res.status(200).json({
          count: responseLength,
          page: query.page,
          data: creations,
        });
      } catch (e) {
        res.status(200).json({ error: e });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
