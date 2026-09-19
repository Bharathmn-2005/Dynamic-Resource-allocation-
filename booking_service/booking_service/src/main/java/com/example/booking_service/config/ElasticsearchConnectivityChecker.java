package com.example.booking_service.config;

import com.example.booking_service.model.TrainSearchDocument;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.elasticsearch", name = "connectivity.check.enabled", havingValue = "true", matchIfMissing = true)
public class ElasticsearchConnectivityChecker {
    private static final Logger log = LoggerFactory.getLogger(ElasticsearchConnectivityChecker.class);

    private final ElasticsearchOperations elasticsearchOperations;

    public ElasticsearchConnectivityChecker(ElasticsearchOperations elasticsearchOperations) {
        this.elasticsearchOperations = elasticsearchOperations;
    }

    @PostConstruct
    public void verifyConnectivity() {
        try {
            boolean exists = elasticsearchOperations.indexOps(TrainSearchDocument.class).exists();
            log.info("Elasticsearch connectivity verified. Index '{}' exists: {}", TrainSearchDocument.INDEX_NAME, exists);
        } catch (Exception ex) {
            throw new IllegalStateException(
                    "Elasticsearch is not reachable. Set ELASTICSEARCH_URL to a running Elasticsearch instance (for Docker: http://elasticsearch:9200).",
                    ex
            );
        }
    }
}
