namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.ViewModels.Reviews;
    using SimplyRecipes.Services.Data.Common;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Mapping;

    using Microsoft.EntityFrameworkCore;

    public class ReviewsService : IReviewsService
    {
        private const int TopReviewsFilter = 4;
        private readonly IDeletableEntityRepository<Review> reviewsRepository;
        private readonly IDeletableEntityRepository<Recipe> recipesRepository;

        public ReviewsService(
            IDeletableEntityRepository<Review> reviewsRepository,
            IDeletableEntityRepository<Recipe> recipesRepository)
        {
            this.reviewsRepository = reviewsRepository;
            this.recipesRepository = recipesRepository;
        }

        public async Task<ReviewDetailsViewModel> CreateAsync(CreateReviewInputModel createReviewInputModel, string userId)
        {
            var review = new Review
            {
                Title = createReviewInputModel.Title,
                RecipeId = createReviewInputModel.RecipeId,
                UserId = userId,
                Description = createReviewInputModel.Content,
                Rate = createReviewInputModel.Rate,
            };

            var doesExist = await this.reviewsRepository
                .All()
                .Where(x => x.UserId == userId && x.RecipeId == createReviewInputModel.RecipeId)
                .AnyAsync();

            if (doesExist)
            {
                throw new ArgumentException(string.Format(ExceptionMessages.ReviewAlreadyExists, review.Id));
            }
            else
            {
                await this.reviewsRepository.AddAsync(review);
                await this.reviewsRepository.SaveChangesAsync();

                var reviews = await this.reviewsRepository
                    .All()
                    .Where(o => o.RecipeId == createReviewInputModel.RecipeId)
                    .ToListAsync();
                var oldRecipeRate = 0;

                foreach (var currReview in reviews)
                {
                    oldRecipeRate += currReview.Rate;
                }

                var newRating = oldRecipeRate / reviews.Count;

                var newRecipe = await this.recipesRepository
                    .All()
                    .FirstOrDefaultAsync(x => x.Id == createReviewInputModel.RecipeId);
                newRecipe.Rate = newRating;

                this.recipesRepository.Update(newRecipe);
                await this.reviewsRepository.SaveChangesAsync();

                var viewModel = await this.GetViewModelByIdAsync<ReviewDetailsViewModel>(review.Id);

                return viewModel;
            }
        }

        public async Task<int> DeleteReviewByIdAsync(int id)
        {
            var review = await this.reviewsRepository
                .All()
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                throw new NullReferenceException(string.Format(ExceptionMessages.ReviewNotFound, id));
            }

            this.reviewsRepository.Delete(review);
            await this.reviewsRepository.SaveChangesAsync();

            var reviews = await this.reviewsRepository
                .All()
                .Where(o => o.RecipeId == review.RecipeId)
                .ToListAsync();
            var oldRecipeRate = 0;

            foreach (var currReview in reviews)
            {
                oldRecipeRate += currReview.Rate;
            }

            var newRating = oldRecipeRate / reviews.Count;

            var newRecipe = await this.recipesRepository
                .All()
                .FirstOrDefaultAsync(x => x.Id == review.RecipeId);
            newRecipe.Rate = newRating;

            this.recipesRepository.Update(newRecipe);
            await this.reviewsRepository.SaveChangesAsync();

            return newRating;
        }

        public async Task<TViewModel> GetViewModelByIdAsync<TViewModel>(int id)
        {
            var reviewViewModel = await this.reviewsRepository
                .All()
                .Where(r => r.Id == id)
                .To<TViewModel>()
                .FirstOrDefaultAsync();

            if (reviewViewModel == null)
            {
                throw new NullReferenceException(string.Format(ExceptionMessages.ReviewNotFound, id));
            }

            return reviewViewModel;
        }

        public async Task<IEnumerable<TViewModel>> GetAll<TViewModel>(int recipeId)
        {
            var reviews = await this.reviewsRepository
                .All()
                .Where(r => r.RecipeId == recipeId)
                .To<TViewModel>()
                .ToListAsync();

            if (reviews.Count == 0)
            {
                throw new NullReferenceException(string.Format(ExceptionMessages.ReviewsNotFound));
            }

            return reviews;
        }

        public async Task<IEnumerable<TViewModel>> GetTopReviews<TViewModel>()
        {
            var topReviews = await this.reviewsRepository
               .All()
               .Where(r => r.Rate >= TopReviewsFilter)
               .To<TViewModel>()
               .ToListAsync();

            return topReviews;
        }
    }
}
