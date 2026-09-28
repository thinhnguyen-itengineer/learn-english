FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend/src/LearnEnglish.Api/LearnEnglish.Api.csproj", "backend/src/LearnEnglish.Api/"]
RUN dotnet restore "backend/src/LearnEnglish.Api/LearnEnglish.Api.csproj"
COPY . .
WORKDIR "/src/backend/src/LearnEnglish.Api"
RUN dotnet build "LearnEnglish.Api.csproj" -c Release -o /app/build
RUN dotnet publish "LearnEnglish.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "LearnEnglish.Api.dll"]
