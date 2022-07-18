select rd.external_id, rd.geom, rd.tile18_x, rd.tile18_y, rd.cape_survey_id,
		bd.cape_deleted_date, bd.first_post_demolition, bd.id as building_id, bd.first_seen as first_seen, bd.last_seen as last_seen,
		sv.image_date as sv_image_date
from cape_buildings.buildings as bd
		inner join cape_buildings.roof_detections_buildings as rdb on rdb.building_id = bd.id
		inner join cape_buildings.roof_detections as rd on rd.id = rdb.roof_detection_id
		inner join cape_buildings.surveys as sv on sv.id = rd.cape_survey_id
where bd.cape_deleted_date is not null
and bd.last_seen=sv.image_date
order by building_id