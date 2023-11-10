namespace SimplyRecipes.Services.Data.Tests
{
    using System.Reflection;

    using Microsoft.Data.Sqlite;
    using Microsoft.EntityFrameworkCore;
    using Newtonsoft.Json;

    using SimplyRecipes.Data;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Repositories;
    using SimplyRecipes.Models.InputModels.Administration.Faq;
    using SimplyRecipes.Models.ViewModels.Faq;
    using SimplyRecipes.Services.Data.Common;
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

            Assert.Equal(1, count);
        }

        [Fact]
        public async Task CheckSettingFaqEntryProperties()
        {
            var model = new FaqCreateInputModel
            {
                Question = "What do you think about the website?",
                Answer = "I think it's very good."
            };

            await this.faqService.CreateAsync(model);

            var faqEntry = await this.faqEntriesRepository.All().FirstOrDefaultAsync();

            Assert.Equal(model.Question, faqEntry.Question);
            Assert.Equal(model.Answer, faqEntry.Answer);
        }

        [Fact]
        public async Task CheckIfAddingFaqEntryThrowsArgumentException()
        {
            await this.SeedFaqEntriesAsync();

            var faqEntry = new FaqCreateInputModel
            {
                Question = this.firstFaqEntry.Question,
                Answer = this.firstFaqEntry.Answer,
            };

            var exception = await Assert
                .ThrowsAsync<ArgumentException>(async () => await this.faqService.CreateAsync(faqEntry));

            Assert.Equal(string.Format(
                ExceptionMessages.FaqAlreadyExists, faqEntry.Question, faqEntry.Answer), exception.Message);
        }

        [Fact]
        public async Task CheckIfAddingFaqEntryReturnsViewModel()
        {
            var faqEntry = new FaqCreateInputModel
            {
                Question = "What do you think about our reviews?",
                Answer = "There are good.",
            };

            var viewModel = await this.faqService.CreateAsync(faqEntry);
            var dbEntry = await this.faqEntriesRepository.All().FirstOrDefaultAsync();

            Assert.Equal(dbEntry.Id, viewModel.Id);
            Assert.Equal(dbEntry.Question, viewModel.Question);
            Assert.Equal(dbEntry.Answer, viewModel.Answer);
        }

        [Fact]
        public async Task CheckIfDeletingFaqEntryWorksCorrectly()
        {
            await this.SeedFaqEntriesAsync();

            await this.faqService.DeleteByIdAsync(this.firstFaqEntry.Id);

            var count = await this.faqEntriesRepository.All().CountAsync();

            Assert.Equal(0, count);
        }

        [Fact]
        public async Task CheckIfDeletingFaqEntryReturnsNullReferenceException()
        {
            await this.SeedFaqEntriesAsync();

            var exception = await Assert
                .ThrowsAsync<NullReferenceException>(async () => await this.faqService.DeleteByIdAsync(2));

            Assert.Equal(string.Format(ExceptionMessages.FaqNotFound, 2), exception.Message);
        }

        [Fact]
        public async Task CheckIfEditingFaqEntryWorksCorrectly()
        {
            await this.SeedFaqEntriesAsync();

            var faqEditViewModel = new FaqEditViewModel
            {
                Id = this.firstFaqEntry.Id,
                Answer = "Changed Answer",
                Question = "Changed Question",
            };

            await this.faqService.EditAsync(faqEditViewModel);

            Assert.Equal(faqEditViewModel.Answer, this.firstFaqEntry.Answer);
            Assert.Equal(faqEditViewModel.Question, this.firstFaqEntry.Question);
        }

        [Fact]
        public async Task CheckIfEditingFaqEntryReturnsNullReferenceException()
        {
            await this.SeedFaqEntriesAsync();

            var faqEditViewModel = new FaqEditViewModel
            {
                Id = 2
            };

            var exception = await Assert
                .ThrowsAsync<NullReferenceException>(async () => await this.faqService.EditAsync(faqEditViewModel));

            Assert.Equal(string.Format(ExceptionMessages.FaqNotFound, faqEditViewModel.Id), exception.Message);
        }

        [Fact]
        public async Task CheckIfGetAllAsyncWorksCorrectly()
        {
            await this.SeedFaqEntriesAsync();

            var result = await this.faqService.GetAllAsync<FaqDetailsViewModel>();

            var count = result.Count();
            Assert.Equal(1, count);
        }

        [Fact]
        public async Task CheckIfGetFaqViewModelByIdAsyncWorksCorrectly()
        {
            await this.SeedFaqEntriesAsync();

            var expectedModel = new FaqDetailsViewModel
            {
                Id = this.firstFaqEntry.Id,
                Answer = this.firstFaqEntry.Answer,
                Question = this.firstFaqEntry.Question,
            };

            var viewModel = await this.faqService
                .GetViewModelByIdAsync<FaqDetailsViewModel>(this.firstFaqEntry.Id);

            var expected = JsonConvert.SerializeObject(expectedModel);
            var actual = JsonConvert.SerializeObject(viewModel);

            Assert.Equal(expected, actual);
        }

        [Fact]
        public async Task CheckIfGetViewModelByIdAsyncThrowsNullReferenceException()
        {
            await this.SeedFaqEntriesAsync();

            var exception = await Assert
                .ThrowsAsync<NullReferenceException>(
                    async () => await this.faqService.GetViewModelByIdAsync<FaqDetailsViewModel>(2));

            Assert.Equal(string.Format(ExceptionMessages.FaqNotFound, 2), exception.Message);
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

        private async Task SeedFaqEntriesAsync()
        {
            await this.faqEntriesRepository.AddAsync(this.firstFaqEntry);
            await this.faqEntriesRepository.SaveChangesAsync();
        }

        private void InitializeMapper() => AutoMapperConfig
            .RegisterMappings(Assembly.Load("SimplyRecipes.Models.ViewModels"));
    }
}