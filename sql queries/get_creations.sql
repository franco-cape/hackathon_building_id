--select * from cape_buildings.roof_detections
--inner join
--(select MIN(roof_detection_id) as mid from (
--	select * from cape_buildings.roof_detections_buildings
--) as unique_bid group by building_id) min_unique_bid
--on min_unique_bid.mid = cape_buildings.roof_detections.id
--order by id


select rd.external_id, rd.geom, rd.tile18_x, rd.tile18_y, rd.cape_survey_id,
		bd.cape_deleted_date, bd.first_post_demolition, bd.id as building_id, bd.first_seen as first_seen, bd.last_seen as last_seen,
		sv.image_date as sv_image_date
from cape_buildings.buildings as bd
		inner join cape_buildings.roof_detections_buildings as rdb on rdb.building_id = bd.id
		inner join cape_buildings.roof_detections as rd on rd.id = rdb.roof_detection_id
		inner join cape_buildings.surveys as sv on sv.id = rd.cape_survey_id
where bd.first_seen=sv.image_date
order by building_id