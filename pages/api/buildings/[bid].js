// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import "../../../prisma/patch";

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB
export default async function handler({ method, query }, res) {
  switch (method) {
    case "GET":
      try {
        const creations = await prisma.$queryRaw`
          select rd.external_id, st_asgeojson(rd.geom, 8, 4326), rd.tile18_x, rd.tile18_y, rd.cape_survey_id,
              bd.cape_deleted_date, bd.first_post_demolition, bd.id as building_id, bd.first_seen as first_seen, bd.last_seen as last_seen,
              sv.image_date as sv_image_date,
              st_asgeojson(st_centroid(rd.geom)) as centroid
          from cape_buildings.buildings as bd
              inner join cape_buildings.roof_detections_buildings as rdb on rdb.building_id = bd.id
              inner join cape_buildings.roof_detections as rd on rd.id = rdb.roof_detection_id
              inner join cape_buildings.surveys as sv on sv.id = rd.cape_survey_id
          where building_id = ${parseInt(query.bid, 10)}
          order by sv_image_date DESC`;
          
        res.status(200).json({
          buildingId: query.bid,
          numberOfSurverys: creations.length,
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
