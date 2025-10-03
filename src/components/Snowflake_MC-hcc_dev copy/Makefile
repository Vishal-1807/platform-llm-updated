build-nginx:
	@echo "Building nginx..."
	cd nginx && docker build --rm --platform linux/amd64 -t eewnwsd-eu49964.registry.snowflakecomputing.com/penguin_db/data_schema/penguin_repository/nginx_router_mc:latest .
	docker push eewnwsd-eu49964.registry.snowflakecomputing.com/penguin_db/data_schema/penguin_repository/nginx_router_mc:latest

build-mc:
	@echo "Building mc..."
	docker build --rm --platform linux/amd64 -t eewnwsd-eu49964.registry.snowflakecomputing.com/penguin_db/data_schema/penguin_repository/mc_ui:latest .
	docker push eewnwsd-eu49964.registry.snowflakecomputing.com/penguin_db/data_schema/penguin_repository/mc_ui:latest