package org.ltky.config;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.sql.DataSource;

/**
 * lukkarimaatti
 * Created with IntelliJ IDEA.
 * User: laastine
 * Date: 15.12.2014
 */
@Configuration
@EnableWebMvc
@ComponentScan(basePackages =
        {"org.ltky.dao.model", "org.ltky.dao", "org.ltky.task", "org.ltky.controller"})
@EnableJpaRepositories(basePackages = {"org.ltky.dao.model", "org.ltky.dao", "org.ltky.task"})
@EnableTransactionManagement
@PropertySources({
        @PropertySource("classpath:lukkarimaatti.properties"),
        @PropertySource("classpath:log4j.properties")
})
public class WebConfig extends WebMvcConfigurerAdapter {
    private static final Logger LOGGER = Logger.getLogger(WebConfig.class);
    @Autowired
    private Environment environment;

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        LOGGER.debug("Setting up resource handlers");
        registry.addResourceHandler("/app/**").addResourceLocations("/app/**");
    }

    @Bean
    public DataSource getDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(environment.getProperty("jdbc.driverClassName"));
        dataSource.setUrl(environment.getProperty("jdbc.url"));
        dataSource.setUsername(environment.getProperty("jdbc.username"));
        dataSource.setPassword(environment.getProperty("jdbc.password"));
        return dataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactoryBean.setDataSource(getDataSource());
        entityManagerFactoryBean.setPackagesToScan("org.ltky.dao.model");
        entityManagerFactoryBean.getJpaPropertyMap().put("hibernate.dialect", environment.getProperty("hibernate.dialect"));
        entityManagerFactoryBean.getJpaPropertyMap().put("hibernate.temp.use_jdbc_metadata_defaults", false);
        HibernateJpaVendorAdapter hibernateJpaVendorAdapter = new HibernateJpaVendorAdapter();
        hibernateJpaVendorAdapter.setGenerateDdl(true);
        hibernateJpaVendorAdapter.setShowSql(false);
        entityManagerFactoryBean.setJpaVendorAdapter(hibernateJpaVendorAdapter);
        return entityManagerFactoryBean;
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        return new JpaTransactionManager(entityManagerFactory().getObject());
    }
}