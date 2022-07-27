// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import "../../../prisma/patch";

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB
export default async function handler({ method, query }, res) {
  switch (method) {
    case "GET":
      try {
        const buildings = await prisma.$queryRaw`
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

        const rd = buildings[0];

        console.log('Roof detection: ', rd);

        const beforeConstruction = await prisma.$queryRaw`
          select s.id as cape_survey_id, s.image_date as sv_image_date
          from cape_buildings.surveys as s
                 join cape_buildings.tiles_segmented t on s.id = t.cape_survey_id
          where tile18_x = ${parseInt(rd.tile18_x, 10)}
            and tile18_y = ${parseInt(rd.tile18_y, 10)}
            and image_date = (
            select max(image_date)
            from cape_buildings.surveys s2
                   join cape_buildings.tiles_segmented ts on s2.id = ts.cape_survey_id
            where s2.image_date < ${rd.first_seen}
              and ts.tile18_x = ${parseInt(rd.tile18_x, 10)}
              and ts.tile18_y = ${parseInt(rd.tile18_y, 10)})`;

        console.log('Before construction: ', beforeConstruction);
        if (beforeConstruction?.length && buildings.length) {

          const beforeConstructionState = {...buildings[0],...beforeConstruction[0]}
          console.log('Before construction state: ', beforeConstructionState);
          buildings.push(beforeConstructionState)

        }

        res.status(200).json({
          buildingId: query.bid,
          numberOfSurverys: buildings.length,
          data: buildings,
        });
      } catch (e) {
        console.error(e)
        res.status(200).json({ error: e });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
