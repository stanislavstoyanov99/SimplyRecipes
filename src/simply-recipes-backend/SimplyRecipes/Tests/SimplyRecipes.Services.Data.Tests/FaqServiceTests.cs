namespace SimplyRecipes.Services.Data.Tests
{
    using System.Reflection;

    using Microsoft.Data.Sqlite;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Data;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Repositories;
    using SimplyRecipes.Models.InputModels.Administration.Faq;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Mapping;

    public class FaqServiceTests : IAsyncDisposable
    {
        private readonly IFaqService faqService;
        private EfDeletableEntityRepository<FaqEntry> faqEntriesRepository;
        private SqliteConnection connection;
        private FaqEntry firstFaqEntry;

        public FaqServiceTests()
        {
            this.InitializeMapper();
            this.InitializeDatabaseAndRepositories();
            this.InitializeData();

            this.faqService = new FaqService(this.faqEntriesRepository);
        }

        [Fact]
        public async Task TestAddingFaqEntry()
        {
            var model = new FaqCreateInputModel
            {
                Question = "How can I register?",
                Answer = "Use the register form."
            };

            await this.faqService.CreateAsync(model);
            var count = await this.faqEntriesRepository.All().CountAsync();

            Assert.Equal(2, count);
        }

        public async ValueTask DisposeAsync()
        {
            await this.connection.CloseAsync();
            await this.connection.DisposeAsync();
        }

        private void InitializeDatabaseAndRepositories()
        {
            this.connection = new SqliteConnection("DataSource=:memory:");
            this.connection.Open();

            var optionsBuilder = new DbContextOptionsBuilder<SimplyRecipesDbContext>().UseSqlite(this.connection);
            var dbContext = new SimplyRecipesDbContext(optionsBuilder.Options);

            dbContext.Database.EnsureCreated();
            this.faqEntriesRepository = new EfDeletableEntityRepository<FaqEntry>(dbContext);
        }

        private void InitializeData()
        {
            this.firstFaqEntry = new FaqEntry
            {
                Question = "Test Question",
                Answer = "Test Answer"
            };
        }

        private async Task SeedFaqEntries()
        {
            await this.faqEntriesRepository.AddAsync(this.firstFaqEntry);
            await this.faqEntriesRepository.SaveChangesAsync();
        }

        private void InitializeMapper() => AutoMapperConfig
            .RegisterMappings(Assembly.Load("SimplyRecipes.Models.ViewModels"));
    }
}