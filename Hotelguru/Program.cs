using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using HotelGuru.DataContext.Context;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer("Server=(LocalDB)\\MSSQLLocalDB;Database=HotelGuruDB;Trusted_Connection=True;TrustServerCertificate=True;",options=>options.MigrationsAssembly("HotelGuru"));
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HotelGuru API",
        Version = "v1"
    });

});
var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HotelGuru API V1");
    c.RoutePrefix = "";
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
