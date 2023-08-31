namespace SimplyRecipes.Data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using Microsoft.AspNetCore.Identity;

    using SimplyRecipes.Data.Common.Models;
    using SimplyRecipes.Data.Models.Enumerations;
    using static SimplyRecipes.Data.Common.DataValidation;

    public class SimplyRecipesUser : IdentityUser, IAuditInfo, IDeletableEntity
    {
        public SimplyRecipesUser()
        {
            this.Id = Guid.NewGuid().ToString();

            this.Roles = new HashSet<IdentityUserRole<string>>();
            this.Claims = new HashSet<IdentityUserClaim<string>>();
            this.Logins = new HashSet<IdentityUserLogin<string>>();

            this.Articles = new HashSet<Article>();
            this.ArticleComments = new HashSet<ArticleComment>();
            this.Recipes = new HashSet<Recipe>();
            this.Reviews = new HashSet<Review>();
            this.ReviewComments = new HashSet<ReviewComment>();
        }

        [MaxLength(UserValidation.FirstNameMaxLength)]
        [MinLength(UserValidation.FirstNameMinLength)]
        public string FirstName { get; set; }

        [MaxLength(UserValidation.LastNameMaxLength)]
        [MinLength(UserValidation.LastNameMinLength)]
        public string LastName { get; set; }

        [Required]
        public Gender Gender { get; set; }

        public string AvatarPath { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? DeletedOn { get; set; }

        public virtual ICollection<IdentityUserRole<string>> Roles { get; set; }

        public virtual ICollection<IdentityUserClaim<string>> Claims { get; set; }

        public virtual ICollection<IdentityUserLogin<string>> Logins { get; set; }

        public virtual ICollection<Article> Articles { get; set; }

        public virtual ICollection<ArticleComment> ArticleComments { get; set; }

        public virtual ICollection<Recipe> Recipes { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }

        public virtual ICollection<ReviewComment> ReviewComments { get; set; }

        public string FacebookIdentifierLoginId { get; set; }

        public virtual FacebookIdentifierLogin FacebookIdentifierLogin { get; set; }
    }
}
