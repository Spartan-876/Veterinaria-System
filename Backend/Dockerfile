FROM eclipse-temurin:21-jdk-jammy AS build
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
WORKDIR /build
COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY src/ src/
RUN mvn package -DskipTests -B && \
    mv target/veterinaria-*.jar target/app.jar

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /build/target/app.jar app.jar
EXPOSE 8083
ENV SERVER_PORT=8083
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/Veterinaria
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=123456
ENV JWT_SECRET=huellitas2026_clave_super_secreta_larga_para_jwt
ENV JWT_EXPIRATION=86400000
ENV CORS_ALLOWED_ORIGINS=http://localhost:4200,https://vethuellitas.jacm.pro/

ENTRYPOINT ["java", "-jar", "app.jar"]
