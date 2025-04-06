using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using HotelGuru.DataContext.Context;
using HotelGuru.Services;
using Microsoft.Extensions.Options;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer("Server=(LocalDB)\\MSSQLLocalDB;Database=HotelGuruDB;Trusted_Connection=True;TrustServerCertificate=True;",options=>options.MigrationsAssembly("HotelGuru"));
});

builder.Services.AddScoped<ISzobaService, SzobaService>();
builder.Services.AddScoped<IAdminisztratorService, AdminisztratorService>();
builder.Services.AddScoped<IFelhasznaloService, FelhasznaloService>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HotelGuru API",
        Version = "v1"
    });
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

});
var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "HotelGuru API v1"));
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
