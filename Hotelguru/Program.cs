using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using HotelGuru.DataContext.Context;
using HotelGuru.Services;
using Microsoft.Extensions.Options;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
    policy =>
    {
        policy.WithOrigins("http://localhost:3000")
             .AllowAnyMethod()
             .AllowAnyHeader()
             .AllowCredentials();
    });
});


var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]))
    };
});


builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer("Server=(LocalDB)\\MSSQLLocalDB;Database=HotelGuruDB;Trusted_Connection=True;TrustServerCertificate=True;", options => options.MigrationsAssembly("HotelGuru"));
});

builder.Services.AddScoped<ISzobaService, SzobaService>();
builder.Services.AddScoped<IAdminisztratorService, AdminisztratorService>();
builder.Services.AddScoped<IFelhasznaloService, FelhasznaloService>();
builder.Services.AddScoped<IRecepciosService, RecepciosService>();
builder.Services.AddScoped<IJwtService, JwtService>(); 
builder.Services.AddScoped<IFoglalasService, FoglalasService>();
builder.Services.AddScoped<IRecepciosService, RecepciosService>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HotelGuru API",
        Version = "v1"
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below. Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "HotelGuru API v1"));
}


app.UseCors("AllowReactApp");

app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.UseCors("AllowReactApp");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        
        HotelGuru.DataContext.DbInitializer.Initialize(services);
        Console.WriteLine("Database initialized successfully.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Hiba történt az adatbázis inicializálása során.");
        Console.WriteLine($"Database initialization error: {ex.Message}");
    }
}

app.Run();