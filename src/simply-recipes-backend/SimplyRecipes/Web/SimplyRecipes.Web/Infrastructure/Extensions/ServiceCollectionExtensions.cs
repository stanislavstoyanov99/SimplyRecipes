namespace SimplyRecipes.Web.Infrastructure.Extensions
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Reflection;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.OpenApi.Models;

    using SimplyRecipes.Common.Config;
    using SimplyRecipes.Data;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Repositories;
    using SimplyRecipes.Services.Data;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Messaging;
    using SimplyRecipes.Web.Infrastructure.Services;

    using Swashbuckle.AspNetCore.Filters;

    public static class ServiceCollectionExtensions
    {
        public static ApplicationConfig GetApplicationConfig(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var appConfigSection = configuration.GetSection("ApplicationConfig");
            services.Configure<ApplicationConfig>(appConfigSection);

            return appConfigSection.Get<ApplicationConfig>();
        }

        public static IServiceCollection AddDatabase(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services
               .AddDbContext<SimplyRecipesDbContext>(
                   options =>
                   {
                       options.UseSqlServer(configuration.GetDefaultConnectionString());
                   });

            return services;
        }

        public static IServiceCollection AddIdentity(this IServiceCollection services)
        {
            services
                .AddIdentity<SimplyRecipesUser, ApplicationRole>(options =>
                {
                    // Turn off rules for testing purposes
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequiredLength = 6;
                    options.SignIn.RequireConfirmedEmail = false;
                    options.User.RequireUniqueEmail = false;

                    var bulgarianCapitalLetters = Enumerable.Range('А', 'Я' - 'А' + 1)
                        .Select(i => ((char)i).ToString())
                        .Where(i => i != "Ы" && i != "Э")
                        .ToArray();

                    var bulgarianSmallLetters = Enumerable.Range('а', 'я' - 'а' + 1)
                        .Select(i => ((char)i).ToString())
                        .Where(i => i != "ы" && i != "э")
                        .ToArray();

                    var cyrillicAlphabet = string.Join("", bulgarianCapitalLetters) + "" + string.Join("", bulgarianSmallLetters);

                    options.User.AllowedUserNameCharacters = cyrillicAlphabet + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+/ ";
                })
                .AddRoles<ApplicationRole>()
                .AddEntityFrameworkStores<SimplyRecipesDbContext>()
                .AddDefaultTokenProviders();

            return services;
        }

        public static IServiceCollection AddAuthentication(
            this IServiceCollection services,
            ApplicationConfig appConfig)
        {
            services
                .AddAuthentication()
                .AddCookie();

            return services;
        }

        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var logger = services
                .BuildServiceProvider()
                .GetService<ILoggerFactory>()
                .CreateLogger(typeof(SendGridEmailSender));

            services
               .AddScoped(typeof(IDeletableEntityRepository<>), typeof(EfDeletableEntityRepository<>))
               .AddScoped(typeof(IRepository<>), typeof(EfRepository<>))
               .AddScoped<ICurrentUserService, CurrentUserService>()
               .AddTransient<IEmailSender>(
                    serviceProvider => new SendGridEmailSender(configuration["SendGridSimplyRecipes:ApiKey"], logger))
               .AddTransient<IArticleCommentsService, ArticleCommentsService>()
               .AddTransient<IArticlesService, ArticlesService>()
               .AddTransient<ICategoriesService, CategoriesService>()
               //.AddTransient<IContactsService, ContactsService>() TODO: fix application config injection
               .AddTransient<IFaqService, FaqService>()
               .AddTransient<IPrivacyService, PrivacyService>()
               .AddTransient<IRecipesService, RecipesService>()
               .AddTransient<IReviewsService, ReviewsService>()
               .AddTransient<ISimplyRecipesUsersService, SimplyRecipesUsersService>();
            services.AddMemoryCache();

            return services;
        }

        public static IServiceCollection AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);

                options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Description = "Standard Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                });

                options.OperationFilter<AppendAuthorizeToSummaryOperationFilter>();
                options.OperationFilter<SecurityRequirementsOperationFilter>();
            });

            return services;
        }
    }
}
