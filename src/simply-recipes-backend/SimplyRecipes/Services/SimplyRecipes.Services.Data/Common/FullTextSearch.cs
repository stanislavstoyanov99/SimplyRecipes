namespace SimplyRecipes.Services.Data.Common
{
    using Nest;

    using System;
    using System.Collections.Generic;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class FullTextSearch : IFullTextSearch
    {
        private readonly IElasticClient elasticClient;

        public FullTextSearch(IElasticClient elasticClient)
        {
            this.elasticClient = elasticClient;
        }

        public Task Index<TDocument>(TDocument value)
            where TDocument : class
            => this.elasticClient.IndexDocumentAsync(value);

        public async Task<IEnumerable<TDocument>> Query<TDocument>(
            Expression<Func<TDocument, object>> field, string query)
            where TDocument : class
        {
            var result = await this.elasticClient
                .SearchAsync<TDocument>(s => s
                    .Query(q => q
                        .MatchPhrase(m => m.Field(field)
                        .Query(query))));

            return result.Documents;
        }
    }
}
