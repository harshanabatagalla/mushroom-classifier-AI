import React, { useState, useEffect } from 'react';
import { Loader2, MessageCircle, Calendar, Filter, Search } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useFeedback } from '../context/FeedbackContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FeedbackPage = () => {
    const [feedback, setFeedback] = useState([]);
    const [filteredFeedback, setFilteredFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [classificationFilter, setClassificationFilter] = useState('all');
    const { getPublicFeedback } = useFeedback();
    const itemsPerPage = 9;

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            try {
                const data = await getPublicFeedback();
                setFeedback(data);
                setFilteredFeedback(data);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    useEffect(() => {
        // Apply filters when search term or classification filter changes
        const results = feedback.filter(item => {
            const matchesSearch = item.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesClassification = classificationFilter === 'all' ||
                (item.image?.classification?.classification === classificationFilter);

            return matchesSearch && matchesClassification;
        });

        setFilteredFeedback(results);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, classificationFilter, feedback]);

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFeedback.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <MainLayout>
            <div className="container py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-3">Community Feedback</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0">
                            Discover what our community is saying about their mushroom identifications and experiences
                        </p>
                    </div>

                    {/* Search and filter controls */}
                    <div className="mb-8 bg-muted p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by text or user name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select
                                    value={classificationFilter}
                                    onValueChange={setClassificationFilter}
                                >
                                    <SelectTrigger>
                                        <div className="flex items-center">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue placeholder="Filter by classification" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Classifications</SelectItem>
                                        <SelectItem value="edible">Edible</SelectItem>
                                        <SelectItem value="poisonous">Poisonous</SelectItem>
                                        <SelectItem value="deadly">Deadly</SelectItem>
                                        <SelectItem value="conditionally_edible">Conditionally Edible</SelectItem>
                                        <SelectItem value="not_a_mushroom">Not a Mushroom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {filteredFeedback.length > 0 && (
                            <div className="mt-4 text-sm text-muted-foreground">
                                Showing {filteredFeedback.length} {filteredFeedback.length === 1 ? 'result' : 'results'}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-32 w-full mb-3" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredFeedback.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No feedback found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm || classificationFilter !== 'all'
                                        ? "No feedback matches your current filters. Try adjusting your search criteria."
                                        : "No community feedback is available at this time. Check back later!"}
                                </p>
                                {(searchTerm || classificationFilter !== 'all') && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setClassificationFilter('all');
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {currentItems.map((item) => (
                                    <FeedbackCard key={item._id} feedback={item} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <Pagination className="mt-12">
                                    <PaginationContent>
                                        {currentPage > 1 && (
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    className="cursor-pointer hover:bg-muted transition-colors"
                                                />
                                            </PaginationItem>
                                        )}

                                        {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                                            // Show window of 5 pages centered around current page
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = index + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = index + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + index;
                                            } else {
                                                pageNum = currentPage - 2 + index;
                                            }

                                            if (pageNum > 0 && pageNum <= totalPages) {
                                                return (
                                                    <PaginationItem key={index}>
                                                        <PaginationLink
                                                            onClick={() => handlePageChange(pageNum)}
                                                            isActive={currentPage === pageNum}
                                                            className="cursor-pointer hover:bg-muted transition-colors"
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        })}

                                        {currentPage < totalPages && (
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    className="cursor-pointer hover:bg-muted transition-colors"
                                                />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

const FeedbackCard = ({ feedback }) => {
    if (!feedback) return null;

    const getClassColor = (classification) => {
        switch (classification) {
            case 'edible':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'poisonous':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'deadly':
                return 'bg-red-200 text-red-900 border-red-400';
            case 'conditionally_edible':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'not_a_mushroom':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getClassificationLabel = (classification) => {
        return classification?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const getInitials = (name) => {
        if (!name) return 'AN';
        return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={feedback.user?.avatar} alt={feedback.user?.name || 'Anonymous'} />
                            <AvatarFallback>{getInitials(feedback.user?.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{feedback.user?.name || 'Anonymous User'}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(feedback.date)}</span>
                            </div>
                        </div>
                    </div>
                    {feedback.image?.classification && (
                        <Badge className={`${getClassColor(feedback.image.classification.classification)}`}>
                            {getClassificationLabel(feedback.image.classification.classification)}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
                {feedback.image && (
                    <div className="relative h-32">
                        <img
                            src={feedback.image.url}
                            alt="Mushroom"
                            className="object-cover w-full h-full"
                        />
                        {feedback.image.classification?.confidence && (
                            <div className="absolute bottom-0 right-0 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-tl-md">
                                <span className="text-white text-xs font-medium">
                                    {Math.round(feedback.image.classification.confidence * 100)}% confidence
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div className="p-4 bg-muted/20 flex-1 border-t">
                    <div className="relative mb-4 overflow-auto">
                        <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg border-l-2 text-sm">"{feedback.text}"</p>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};

export default FeedbackPage;