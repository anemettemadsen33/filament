<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Example Unit Test
 * 
 * Basic unit test demonstrating PHPUnit test structure.
 * Unit tests should test individual components in isolation.
 */
class ExampleTest extends TestCase
{
    /**
     * Test basic assertion
     * 
     * @return void
     */
    public function test_that_true_is_true(): void
    {
        $this->assertTrue(true);
    }

    /**
     * Test string operations
     * 
     * @return void
     */
    public function test_string_concatenation(): void
    {
        $firstName = 'John';
        $lastName = 'Doe';
        
        $fullName = $firstName . ' ' . $lastName;
        
        $this->assertEquals('John Doe', $fullName);
        $this->assertStringContainsString('John', $fullName);
    }

    /**
     * Test array operations
     * 
     * @return void
     */
    public function test_array_operations(): void
    {
        $array = [1, 2, 3, 4, 5];
        
        $this->assertCount(5, $array);
        $this->assertContains(3, $array);
        $this->assertEquals(15, array_sum($array));
    }

    /**
     * Test mathematical operations
     * 
     * @return void
     */
    public function test_basic_math(): void
    {
        $result = 2 + 2;
        $this->assertEquals(4, $result);
        
        $result = 10 - 3;
        $this->assertEquals(7, $result);
        
        $result = 5 * 6;
        $this->assertEquals(30, $result);
        
        $result = 20 / 4;
        $this->assertEquals(5, $result);
    }

    /**
     * Test type checking
     * 
     * @return void
     */
    public function test_type_checking(): void
    {
        $this->assertIsInt(42);
        $this->assertIsString('Hello');
        $this->assertIsBool(true);
        $this->assertIsArray([1, 2, 3]);
        $this->assertIsFloat(3.14);
    }

    /**
     * Test null and empty values
     * 
     * @return void
     */
    public function test_null_and_empty_values(): void
    {
        $nullValue = null;
        $emptyString = '';
        $emptyArray = [];
        
        $this->assertNull($nullValue);
        $this->assertEmpty($emptyString);
        $this->assertEmpty($emptyArray);
    }

    /**
     * Test exception handling
     * 
     * @return void
     */
    public function test_exception_is_thrown(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid argument');
        
        throw new \InvalidArgumentException('Invalid argument');
    }
}
