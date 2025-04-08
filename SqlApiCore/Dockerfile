#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["SqlApiCore/SqlApiCore.csproj", "SqlApiCore/"]
RUN dotnet restore "./SqlApiCore/SqlApiCore.csproj"
COPY . .
WORKDIR "/src/SqlApiCore"
RUN dotnet build "./SqlApiCore.csproj" -c $BUILD_CONFIGURATION -o /app/build -f net8.0

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SqlApiCore.csproj" -c $BUILD_CONFIGURATION -o /app/publish -f net8.0 /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SqlApiCore.dll"]