﻿namespace SimplyRecipes.Models.ViewModels.Articles
{
    using System;
    using System.Collections.Generic;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Mapping;
    using SimplyRecipes.Models.ViewModels.ArticleComments;

    using Ganss.Xss;
    
    public class ArticleListingViewModel : IMapFrom<Article>
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string ImagePath { get; set; }

        public string ShortDescription
        {
            get
            {
                var shortDescription = this.Description;
                return shortDescription.Length > 100
                        ? shortDescription.Substring(0, 100) + " ..."
                        : shortDescription;
            }
        }

        public string SanitizedShortDescription => new HtmlSanitizer().Sanitize(this.ShortDescription);

        public string SanitizedDescription => new HtmlSanitizer().Sanitize(this.Description);

        public string UserUsername { get; set; }

        public DateTime CreatedOn { get; set; }

        public string CategoryName { get; set; }

        public string SearchText { get; set; }

        public IEnumerable<PostArticleCommentViewModel> ArticleComments { get; set; }
    }
}
