﻿namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.InputModels.Administration.Articles;
    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Services.Data.Common;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Mapping;

    using Microsoft.EntityFrameworkCore;

    public class ArticlesService : IArticlesService
    {
        private readonly IDeletableEntityRepository<Article> articlesRepository;
        private readonly IDeletableEntityRepository<Category> categoriesRepository;

        public ArticlesService(
            IDeletableEntityRepository<Article> articlesRepository,
            IDeletableEntityRepository<Category> categoriesRepository)
        {
            this.articlesRepository = articlesRepository;
            this.categoriesRepository = categoriesRepository;
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

            article.ImagePath = "";

            await this.articlesRepository.AddAsync(article);
            await this.articlesRepository.SaveChangesAsync();

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

        public async Task EditAsync(ArticleEditViewModel articleEditViewModel, string userId)
        {
            var article = await this.articlesRepository
                .All()
                .FirstOrDefaultAsync(a => a.Id == articleEditViewModel.Id);

            if (article == null)
            {
                throw new NullReferenceException(
                    string.Format(ExceptionMessages.ArticleNotFound, articleEditViewModel.Id));
            }

            article.Title = articleEditViewModel.Title;
            article.Description = articleEditViewModel.Description;
            article.UserId = userId;
            article.CategoryId = articleEditViewModel.CategoryId;

            this.articlesRepository.Update(article);
            await this.articlesRepository.SaveChangesAsync();
        }

        public IQueryable<TViewModel> GetAllArticlesAsQueryeable<TViewModel>()
        {
            var articles = this.articlesRepository
                .All()
                .OrderBy(x => x.Title)
                .ThenByDescending(x => x.CreatedOn)
                .To<TViewModel>();

            return articles;
        }

        public async Task<IEnumerable<TViewModel>> GetAllArticlesAsync<TViewModel>()
        {
            var articles = await this.articlesRepository
              .All()
              .OrderBy(a => a.Title)
              .To<TViewModel>()
              .ToListAsync();

            return articles;
        }

        public IQueryable<TViewModel> GetAllArticlesByCategoryNameAsQueryeable<TViewModel>(string categoryName)
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
    }
}
