﻿namespace SimplyRecipes.Models.ViewModels.ArticleComments
{
    using System;

    using SimplyRecipes.Services.Mapping;
    using SimplyRecipes.Data.Models;

    using Ganss.Xss;

    public class PostArticleCommentViewModel : IMapFrom<ArticleComment>
    {
        public int Id { get; set; }

        public int? ParentId { get; set; }

        public string Content { get; set; }

        public string SanitizedContent => new HtmlSanitizer().Sanitize(this.Content);

        public DateTime CreatedOn { get; set; }

        public string UserUserName { get; set; }
    }
}
