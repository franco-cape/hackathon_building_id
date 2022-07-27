// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import "../../../prisma/patch";

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB
export default async function handler({ method, query }, res) {
  const lng = Number(query.lng);
  const lat = Number(query.lat);
  const distance = Number(query.distance) || 0.01;

  console.log("Coordinates:", [lng, lat]);

  switch (method) {
    case "GET":
      try {
        const buildings = await prisma.$queryRaw`
        WITH buildings_latest_dates as (
            SELECT rdb.building_id, max(s.image_date) as image_date
            FROM cape_buildings.roof_detections rd
                     JOIN cape_buildings.roof_detections_buildings rdb ON rd.id = rdb.roof_detection_id
                     JOIN cape_buildings.surveys s ON rd.cape_survey_id = s.id
            WHERE st_dwithin(geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326), ${distance}) 
            GROUP BY rdb.building_id)
        SELECT rdb2.building_id, rd2.id, s2.id, s2.image_date, st_asgeojson(rd2.geom, 8, 4326),
              st_asgeojson(st_centroid(rd2.geom)) as centroid
        FROM cape_buildings.roof_detections rd2
                 JOIN cape_buildings.surveys s2 ON rd2.cape_survey_id = s2.id
                 JOIN cape_buildings.roof_detections_buildings rdb2 ON rd2.id = rdb2.roof_detection_id
                 JOIN buildings_latest_dates bld ON bld.building_id = rdb2.building_id
        WHERE s2.image_date = bld.image_date
        ORDER BY rdb2.building_id          
        `;

        const responseLength = buildings.length;
        res.status(200).json({
          count: responseLength,
          page: query.page,
          data: buildings,
        });
      } catch (e) {
        console.error(e);
        res.status(200).json({ error: e });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
