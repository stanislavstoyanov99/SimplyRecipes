namespace SimplyRecipes.Services.Data.Tests
{
    using System;
    using System.Reflection;
    using System.Threading.Tasks;

    using CloudinaryDotNet;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Data.Sqlite;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Data;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Models.Enumerations;
    using SimplyRecipes.Data.Repositories;
    using SimplyRecipes.Models.InputModels.Administration.Articles;
    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Services.Data.Common;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Mapping;

    public class ArticleServiceTests : IAsyncDisposable, IClassFixture<Configuration>
    {
        private readonly IArticlesService articlesService;
        private readonly ICloudinaryService cloudinaryService;
        private readonly Cloudinary cloudinary;
        private EfDeletableEntityRepository<Article> articleRepisitory;
        private EfDeletableEntityRepository<Category> categoriesRepository;
        private EfDeletableEntityRepository<SimplyRecipesUser> usersRepository;
        private SqliteConnection connection;

        private Article firstArticle;
        private Category firstCategory;
        private SimplyRecipesUser user;

        public ArticleServiceTests(Configuration configuration)
        {
            this.InitializeMapper();
            this.InitializeDatabaseAndRepositories();
            this.InitializeData();

            Account account = new Account(
              configuration.ConfigurationRoot["Cloudinary:AppName"],
              configuration.ConfigurationRoot["Cloudinary:AppKey"],
              configuration.ConfigurationRoot["Cloudinary:AppSecret"]);

            this.cloudinary = new Cloudinary(account);
            this.cloudinaryService = new CloudinaryService(this.cloudinary);
            this.articlesService = new ArticlesService(
                this.articleRepisitory,
                this.categoriesRepository,
                this.cloudinaryService);
        }

        [Fact]
        public async Task CheckCreatingArticle()
        {
            await this.SeedUsers();
            await this.SeedCategories();

            var path = "Test.jpg";
            ArticleDetailsViewModel articleDetailsViewModel = null;

            using (var img = File.OpenRead(path))
            {
                var testImage = new FormFile(img, 0, img.Length, path, img.Name)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg",
                };

                var model = new ArticleCreateInputModel
                {
                    Title = this.firstArticle.Title,
                    Description = this.firstArticle.Description,
                    Image = testImage,
                    CategoryId = this.firstCategory.Id,
                };
                articleDetailsViewModel = await this.articlesService.CreateAsync(model, this.user.Id);
            }

            await this.cloudinaryService.DeleteImageAsync(
                this.cloudinary, articleDetailsViewModel.Title + Suffixes.ArticleSuffix);
            var count = await this.articleRepisitory.All().CountAsync();

            Assert.Equal(1, count);
        }

        [Fact]
        public async Task CheckCreatingArticleWithMissingCategory()
        {
            await this.SeedUsers();
            await this.SeedCategories();

            var path = "Test.jpg";
            ArticleCreateInputModel model = null;

            using (var img = File.OpenRead(path))
            {
                var testImage = new FormFile(img, 0, img.Length, path, img.Name)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg",
                };

                model = new ArticleCreateInputModel
                {
                    Title = this.firstArticle.Title,
                    Description = this.firstArticle.Description,
                    Image = testImage,
                    CategoryId = 2,
                };
            }

            var exception = await Assert
                .ThrowsAsync<NullReferenceException>(async () =>
                    await this.articlesService.CreateAsync(model, this.user.Id));

            Assert.Equal(string.Format(ExceptionMessages.CategoryNotFound, model.CategoryId), exception.Message);
        }

        [Fact]
        public async Task CheckCreatingAlreadyExistingArticle()
        {
            await this.SeedDatabase();

            var path = "Test.jpg";
            ArticleCreateInputModel model = null;

            using (var img = File.OpenRead(path))
            {
                var testImage = new FormFile(img, 0, img.Length, path, img.Name)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg",
                };

                model = new ArticleCreateInputModel
                {
                    Title = this.firstArticle.Title,
                    Description = this.firstArticle.Description,
                    Image = testImage,
                    CategoryId = this.firstCategory.Id,
                };
            }

            var exception = await Assert
                .ThrowsAsync<ArgumentException>(async () =>
                    await this.articlesService.CreateAsync(model, this.user.Id));

            Assert.Equal(string.Format(ExceptionMessages.ArticleAlreadyExists, model.Title), exception.Message);
        }

        [Fact]
        public async Task CheckIfDeletingArticleWorksCorrectly()
        {
            await this.SeedDatabase();

            await this.articlesService.DeleteByIdAsync(this.firstArticle.Id);

            var count = await this.articleRepisitory.All().CountAsync();

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task CheckIfDeletingArticleReturnsNullReferenceException()
        {
            await this.SeedDatabase();

            var exception = await Assert
                .ThrowsAsync<NullReferenceException>(async () => await this.articlesService.DeleteByIdAsync(2));

            Assert.Equal(string.Format(ExceptionMessages.ArticleNotFound, 2), exception.Message);
        }

        [Fact]
        public async Task CheckIfEditingArticleWorksCorrectly()
        {
            await this.SeedDatabase();

            var path = "Test.jpg";
            ArticleDetailsViewModel articleDetailsViewModel = null;

            using (var img = File.OpenRead(path))
            {
                var testImage = new FormFile(img, 0, img.Length, path, img.Name)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg",
                };

                var model = new ArticleEditViewModel
                {
                    Id = this.firstArticle.Id,
                    Title = "Changed Title",
                    Description = "Changed Description",
                    Image = testImage,
                    CategoryId = this.firstCategory.Id,
                };

                articleDetailsViewModel = await this.articlesService.EditAsync(model, this.user.Id);
            }

            Assert.Equal(articleDetailsViewModel.Title, this.firstArticle.Title);
            Assert.Equal(articleDetailsViewModel.Description, this.firstArticle.Description);
            Assert.Equal(articleDetailsViewModel.ImagePath, this.firstArticle.ImagePath);
        }

        [Fact]
        public async Task CheckIfEditingArticleReturnsNullReferenceException()
        {
            await this.SeedDatabase();

            var articleEditViewModel = new ArticleEditViewModel
            {
                Id = 2
            };

            var exception = await Assert
                .ThrowsAsync<NullReferenceException>(async () => 
                    await this.articlesService.EditAsync(articleEditViewModel, this.user.Id));

            Assert.Equal(string.Format(ExceptionMessages.ArticleNotFound, articleEditViewModel.Id), exception.Message);
        }

        [Fact]
        public async Task CheckIfGetAllAsQueryeableWorksCorrectly()
        {
            await this.SeedDatabase();

            var expected = this.articlesService.GetAllAsQueryeable<ArticleDetailsViewModel>();
            var actualCount = await this.articleRepisitory.All().CountAsync();

            Assert.Equal(expected.First().Title, this.firstArticle.Title);
            Assert.Equal(expected.Count(), actualCount);
        }

        [Fact]
        public async Task CheckIfGetAllByCategoryNameAsQueryeableWorksCorrectly()
        {
            await this.SeedDatabase();

            var expected = this.articlesService
                .GetAllByCategoryNameAsQueryeable<ArticleDetailsViewModel>("Vegetables");
            var actualCount = await this.articleRepisitory.All().CountAsync();

            Assert.Equal(expected.First().Category.Name, this.firstArticle.Category.Name);
            Assert.Equal(expected.Count(), actualCount);
        }

        public async ValueTask DisposeAsync()
        {
            await this.connection.CloseAsync();
            await this.connection.DisposeAsync();
        }

        private void InitializeData()
        {
            this.user = new SimplyRecipesUser
            {
                Id = "1",
                FirstName = "Peter",
                LastName = "Petrov",
                UserName = "Test user 1",
                Gender = Gender.Male,
            };

            this.firstCategory = new Category
            {
                Id = 1,
                Name = "Vegetables",
                Description = "Test description",
            };

            this.firstArticle = new Article
            {
                Title = "Test Article",
                Description = "Test Description",
                ImagePath = "Test IMG path",
                CategoryId = 1,
                UserId = "1",
            };
        }

        private void InitializeDatabaseAndRepositories()
        {
            this.connection = new SqliteConnection("DataSource=:memory:");
            this.connection.Open();
            var options = new DbContextOptionsBuilder<SimplyRecipesDbContext>().UseSqlite(this.connection);
            var dbContext = new SimplyRecipesDbContext(options.Options);

            dbContext.Database.EnsureCreated();

            this.usersRepository = new EfDeletableEntityRepository<SimplyRecipesUser>(dbContext);
            this.categoriesRepository = new EfDeletableEntityRepository<Category>(dbContext);
            this.articleRepisitory = new EfDeletableEntityRepository<Article>(dbContext);
        }

        private async Task SeedArticles()
        {
            await this.articleRepisitory.AddAsync(this.firstArticle);
            await this.articleRepisitory.SaveChangesAsync();
        }

        private async Task SeedUsers()
        {
            await this.usersRepository.AddAsync(this.user);
            await this.usersRepository.SaveChangesAsync();
        }

        private async Task SeedCategories()
        {
            await this.categoriesRepository.AddAsync(this.firstCategory);
            await this.categoriesRepository.SaveChangesAsync();
        }

        private async Task SeedDatabase()
        {
            await this.SeedUsers();
            await this.SeedCategories();
            await this.SeedArticles();
        }

        private void InitializeMapper() => AutoMapperConfig
            .RegisterMappings(Assembly.Load("SimplyRecipes.Models.ViewModels"));
    }
}
