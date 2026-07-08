<?php
declare(strict_types=1);

/**
 * Portfolio OOP sample for PHP/LAMP roles.
 * Demonstrates Controller → Service → Repository → DTO separation.
 */

final class ProjectData
{
    public function __construct(
        public readonly string $name,
        public readonly array $stack,
        public readonly array $impact,
        public readonly bool $productionReady
    ) {}

    public function isProductionReady(): bool
    {
        return $this->productionReady;
    }
}

final class ProjectRepository
{
    /** @return ProjectData[] */
    public function all(): array
    {
        return [
            new ProjectData(
                'Civics Fundamentals Platform Modernization',
                ['WordPress', 'LearnDash', 'PHP', 'MariaDB', 'JavaScript'],
                ['128 modules', '137+ LMS course steps', 'GA4/GTM tracking'],
                true
            ),
            new ProjectData(
                'Internal Operations Workflow Portal',
                ['Laravel', 'PHP', 'MySQL', 'Queues', 'REST APIs'],
                ['RBAC', 'audit logs', 'service classes', 'reporting'],
                true
            ),
            new ProjectData(
                'Billing Reconciliation Dashboard',
                ['PHP', 'SQL', 'CSV', 'Scheduler'],
                ['50k-row sample processing', 'exception handling', 'runbooks'],
                true
            ),
        ];
    }
}

final class ProjectService
{
    public function __construct(private ProjectRepository $projects) {}

    /** @return ProjectData[] */
    public function featured(): array
    {
        return array_values(array_filter(
            $this->projects->all(),
            fn(ProjectData $project): bool => $project->isProductionReady()
        ));
    }
}

$service = new ProjectService(new ProjectRepository());
header('Content-Type: application/json');
echo json_encode($service->featured(), JSON_PRETTY_PRINT);
