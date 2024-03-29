﻿namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Common;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.InputModels.Administration.Articles;
    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Services.Data.Common;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Mapping;

    public class ArticlesService : IArticlesService
    {
        private readonly IDeletableEntityRepository<Article> articlesRepository;
        private readonly IDeletableEntityRepository<Category> categoriesRepository;
        private readonly ICloudinaryService cloudinaryService;

        public ArticlesService(
            IDeletableEntityRepository<Article> articlesRepository,
            IDeletableEntityRepository<Category> categoriesRepository,
            ICloudinaryService cloudinaryService)
        {
            this.articlesRepository = articlesRepository;
            this.categoriesRepository = categoriesRepository;
            this.cloudinaryService = cloudinaryService;
        }

        public async Task<ArticleDetailsViewModel> CreateAsync(ArticleCreateInputModel articleCreateInputModel, string userId)
        {
            var category = await this.categoriesRepository
                .All()
                .FirstOrDefaultAsync(x => x.Id == articleCreateInputModel.CategoryId);
            if (category == null)
            {
                throw new NullReferenceException(
                    string.Format(ExceptionMessages.CategoryNotFound, articleCreateInputModel.CategoryId));
            }

            var article = new Article
            {
                Title = articleCreateInputModel.Title,
                Description = articleCreateInputModel.Description,
                Category = category,
                UserId = userId,
            };

            bool doesArticleExist = await this.articlesRepository
               .All()
               .AnyAsync(a => a.Title == article.Title);
            if (doesArticleExist)
            {
                throw new ArgumentException(
                    string.Format(ExceptionMessages.ArticleAlreadyExists, article.Title));
            }

            var imageUrl = await this.cloudinaryService
                .UploadAsync(articleCreateInputModel.Image, articleCreateInputModel.Title + Suffixes.ArticleSuffix);
            article.ImagePath = imageUrl;

            article.SearchText = Utils.GetSearchText(article.Description, article.Title);

            await this.articlesRepository.AddAsync(article);
            await this.articlesRepository.SaveChangesAsync();

            // Uncomment when ElasticSearch is used
            //await this.fullTextSearch.Index(new ArticleFullTextSearchModel
            //{
            //    ArticleId = article.Id,
            //    Description = article.SearchText
            //});

            var viewModel = await this.GetViewModelByIdAsync<ArticleDetailsViewModel>(article.Id);

            return viewModel;
        }

        public async Task DeleteByIdAsync(int id)
        {
            var article = await this.articlesRepository
                .All()
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                throw new NullReferenceException(
                    string.Format(ExceptionMessages.ArticleNotFound, id));
            }

            this.articlesRepository.Delete(article);
            await this.articlesRepository.SaveChangesAsync();
        }

        public async Task<ArticleDetailsViewModel> EditAsync(ArticleEditViewModel articleEditViewModel, string userId)
        {
            var article = await this.articlesRepository
                .All()
                .FirstOrDefaultAsync(a => a.Id == articleEditViewModel.Id);

            if (article == null)
            {
                throw new NullReferenceException(
                    string.Format(ExceptionMessages.ArticleNotFound, articleEditViewModel.Id));
            }

            if (articleEditViewModel.Image != null)
            {
                var newImageUrl = await this.cloudinaryService
                    .UploadAsync(articleEditViewModel.Image, articleEditViewModel.Title + Suffixes.ArticleSuffix);
                article.ImagePath = newImageUrl;
            }

            article.Title = articleEditViewModel.Title;
            article.Description = articleEditViewModel.Description;
            article.UserId = userId;
            article.CategoryId = articleEditViewModel.CategoryId;
            article.SearchText = Utils.GetSearchText(article.Description, article.Title);

            this.articlesRepository.Update(article);
            await this.articlesRepository.SaveChangesAsync();

            // Uncomment when ElasticSearch is used
            //await this.fullTextSearch.Index(new ArticleFullTextSearchModel
            //{
            //    ArticleId = article.Id,
            //    Description = article.SearchText
            //});

            var viewModel = await this.GetViewModelByIdAsync<ArticleDetailsViewModel>(article.Id);

            return viewModel;
        }

        public IQueryable<TViewModel> GetAllAsQueryeable<TViewModel>()
        {
            var articles = this.articlesRepository
                .All()
                .OrderBy(x => x.Title)
                .ThenByDescending(x => x.CreatedOn)
                .To<TViewModel>();

            return articles;
        }

        public IQueryable<TViewModel> GetAllByCategoryNameAsQueryeable<TViewModel>(string categoryName)
        {
            var articles = this.articlesRepository
                .All()
                .Where(a => a.Category.Name == categoryName)
                .OrderBy(a => a.Title)
                .To<TViewModel>();

            return articles;
        }

        public async Task<IEnumerable<TViewModel>> GetRecentArticlesAsync<TViewModel>(int count = 0)
        {
            var recentArticles = await this.articlesRepository
                .All()
                .OrderByDescending(a => a.CreatedOn)
                .Take(count)
                .To<TViewModel>()
                .ToListAsync();

            return recentArticles;
        }

        public async Task<TViewModel> GetViewModelByIdAsync<TViewModel>(int id)
        {
            var articlesViewModel = await this.articlesRepository
                .All()
                .Where(a => a.Id == id)
                .To<TViewModel>()
                .FirstOrDefaultAsync();

            if (articlesViewModel == null)
            {
                throw new NullReferenceException(string.Format(ExceptionMessages.ArticleNotFound, id));
            }

            return articlesViewModel;
        }

        public IQueryable<ArticleListingViewModel> GetAllAsQueryeableBySearchQuery(string searchQuery)
        {
            var articles = this.articlesRepository
               .All()
               .OrderBy(x => x.Title)
               .ThenByDescending(x => x.CreatedOn)
               .To<ArticleListingViewModel>();

            var words = searchQuery?
                .Split(' ')
                .Select(x => x.Trim())
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToList();

            if (words != null)
            {
                foreach (var word in words)
                {
                    articles = articles.Where(a => EF.Functions.FreeText(a.SearchText, word));
                }
            }

            return articles;
        }
    }
}
