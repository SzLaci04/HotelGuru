using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Hotelguru.DataContext.Context;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer("Server=(LocalDB)\\MSSQLLocalDB;Database=HotelGuruDB;Trusted_Connection=True;TrustServerCertificate=True;");
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
