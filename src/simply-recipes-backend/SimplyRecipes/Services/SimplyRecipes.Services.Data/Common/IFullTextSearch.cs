namespace SimplyRecipes.Services.Data.Common
{
    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public interface IFullTextSearch
    {
        Task Index<TDocument>(TDocument value)
            where TDocument : class;

        Task<IEnumerable<TDocument>> Query<TDocument>(
            Expression<Func<TDocument, object>> field, string query)
            where TDocument : class;
    }
}
