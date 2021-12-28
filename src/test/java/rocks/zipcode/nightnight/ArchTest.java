package rocks.zipcode.nightnight;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("rocks.zipcode.nightnight");

        noClasses()
            .that()
            .resideInAnyPackage("rocks.zipcode.nightnight.service..")
            .or()
            .resideInAnyPackage("rocks.zipcode.nightnight.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..rocks.zipcode.nightnight.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
