package pl.pwr.cinematicketsystem.integration;

import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.PostgreSQLContainer;

final class PostgresTestContainer {

    private static final PostgreSQLContainer<?> CONTAINER = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("cinema")
        .withUsername("cinema")
        .withPassword("cinema");

    private static boolean initialized;

    private PostgresTestContainer() {}

    static boolean isDockerAvailable() {
        return DockerClientFactory.instance().isDockerAvailable();
    }

    static PostgreSQLContainer<?> get() {
        ensureReady();
        return CONTAINER;
    }

    static synchronized void ensureReady() {
        if (!isDockerAvailable()) {
            return;
        }
        if (!CONTAINER.isRunning()) {
            CONTAINER.start();
        }
        if (!initialized) {
            initializeSchema();
            initialized = true;
        }
    }

    private static void initializeSchema() {
        var populator = new ResourceDatabasePopulator(
            new ClassPathResource("schema.sql"),
            new ClassPathResource("data.sql")
        );
        populator.setSeparator(";");
        populator.execute(createDataSource());
    }

    private static SimpleDriverDataSource createDataSource() {
        var dataSource = new SimpleDriverDataSource();
        dataSource.setDriverClass(org.postgresql.Driver.class);
        dataSource.setUrl(CONTAINER.getJdbcUrl());
        dataSource.setUsername(CONTAINER.getUsername());
        dataSource.setPassword(CONTAINER.getPassword());
        return dataSource;
    }
}
